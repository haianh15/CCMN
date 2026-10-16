import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const response = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return response({ success: false, errorCode: 'INVALID_REQUEST' }, 405);

  const authorization = request.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!authorization?.startsWith('Bearer ') || !supabaseUrl || !anonKey || !serviceRoleKey) {
    return response({ success: false, errorCode: 'SESSION_INVALID' });
  }

  const token = authorization.slice('Bearer '.length);
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const verificationClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data: authData, error: authError } = await userClient.auth.getUser(token);
    if (authError || !authData.user) {
      return response({ success: false, error: 'Phiên làm việc đã kết thúc. Vui lòng đăng nhập lại.', errorCode: 'SESSION_INVALID' });
    }
    const user = authData.user;

    const body = await request.json().catch(() => null);
    const requestId = body?.requestId;
    const currentPassword = body?.currentPassword;
    const newPassword = body?.newPassword;
    const confirmPassword = body?.confirmPassword;
    if (
      typeof requestId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId) ||
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      typeof confirmPassword !== 'string' ||
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return response({ success: false, error: 'Yêu cầu không hợp lệ. Vui lòng thử lại.', errorCode: 'INVALID_REQUEST' });
    }
    if (newPassword !== confirmPassword) {
      return response({ success: false, error: 'Xác nhận mật khẩu không khớp.', errorCode: 'CONFIRMATION_MISMATCH' });
    }
    if (newPassword.length < 12) {
      return response({ success: false, error: 'Mật khẩu mới cần có ít nhất 12 ký tự.', errorCode: 'PASSWORD_POLICY' });
    }
    if (newPassword === currentPassword) {
      return response({ success: false, error: 'Mật khẩu mới phải khác mật khẩu hiện tại.', errorCode: 'PASSWORD_UNCHANGED' });
    }

    const { data: priorRequest, error: priorRequestError } = await serviceClient
      .from('first_password_change_requests')
      .select('user_id, status, updated_at')
      .eq('request_id', requestId)
      .maybeSingle();
    if (priorRequestError) throw priorRequestError;
    if (priorRequest && priorRequest.user_id !== user.id) {
      return response({ success: false, error: 'Yêu cầu không hợp lệ. Vui lòng thử lại.', errorCode: 'INVALID_REQUEST' });
    }
    if (priorRequest?.status === 'completed') {
      return response({
        success: false,
        error: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại bằng mật khẩu mới.',
        errorCode: 'PASSWORD_UPDATED_RELOGIN',
      });
    }
    const staleRequest = priorRequest?.status === 'processing' &&
      Date.now() - Date.parse(priorRequest.updated_at) >= 300_000;
    if (priorRequest?.status === 'processing' && !staleRequest) {
      return response({ success: false, error: 'Yêu cầu đang được xử lý. Vui lòng chờ.', errorCode: 'PROCESSING' });
    }

    if (user.app_metadata.must_change_password !== true) {
      return response({ success: false, error: 'Phiên làm việc đã kết thúc. Vui lòng đăng nhập lại.', errorCode: 'SESSION_INVALID' });
    }

    const { data: activeRequest, error: activeRequestError } = await serviceClient
      .from('first_password_change_requests')
      .select('request_id, updated_at')
      .eq('user_id', user.id)
      .eq('status', 'processing')
      .neq('request_id', requestId)
      .maybeSingle();
    if (activeRequestError) throw activeRequestError;
    if (activeRequest) {
      if (Date.now() - Date.parse(activeRequest.updated_at) < 300_000) {
        return response({ success: false, error: 'Yêu cầu đang được xử lý. Vui lòng chờ.', errorCode: 'PROCESSING' });
      }
      const { data: expiredRequest, error: expireRequestError } = await serviceClient
        .from('first_password_change_requests')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('request_id', activeRequest.request_id)
        .eq('status', 'processing')
        .eq('updated_at', activeRequest.updated_at)
        .select('request_id')
        .maybeSingle();
      if (expireRequestError) throw expireRequestError;
      if (!expiredRequest) {
        return response({ success: false, error: 'Yêu cầu đang được xử lý. Vui lòng chờ.', errorCode: 'PROCESSING' });
      }
    }

    const { data: lockUntil, error: lockError } = await userClient.rpc('check_password_change_lock');
    if (lockError) throw lockError;
    if (lockUntil && new Date(lockUntil).getTime() > Date.now()) {
      return response({
        success: false,
        error: 'Tạm thời chưa thể đổi mật khẩu. Vui lòng thử lại sau.',
        errorCode: 'LOCKED_OUT',
      });
    }

    const requestValues = {
      request_id: requestId,
      user_id: user.id,
      status: 'processing',
      updated_at: new Date().toISOString(),
    };
    const startRequest = priorRequest?.status === 'failed' || staleRequest
      ? await serviceClient.from('first_password_change_requests')
        .update(requestValues)
        .eq('request_id', requestId)
        .in('status', ['failed', 'processing'])
        .eq('updated_at', priorRequest?.updated_at ?? '')
        .select('request_id')
        .maybeSingle()
      : await serviceClient.from('first_password_change_requests')
        .insert(requestValues)
        .select('request_id')
        .maybeSingle();
    const { data: startedRequest, error: startRequestError } = startRequest;
    if (startRequestError?.code === '23505') {
      return response({ success: false, error: 'Yêu cầu đang được xử lý. Vui lòng chờ.', errorCode: 'PROCESSING' });
    }
    if (startRequestError) throw startRequestError;
    if (!startedRequest) {
      return response({ success: false, error: 'Yêu cầu đang được xử lý. Vui lòng chờ.', errorCode: 'PROCESSING' });
    }

    const { error: verifyError } = await verificationClient.auth.signInWithPassword({
      email: user.email ?? '',
      password: currentPassword,
    });
    if (verifyError) {
      if (!verifyError.message.toLowerCase().includes('invalid login credentials')) throw verifyError;
      const { data: failedUntil, error: failureError } = await userClient.rpc('record_password_change_failure');
      if (failureError) throw failureError;
      const { error: failedRequestError } = await serviceClient.from('first_password_change_requests')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('request_id', requestId);
      if (failedRequestError) console.error('Failed to persist the failed password-change request.', failedRequestError);
      const { error: auditError } = await serviceClient.from('auth_security_events')
        .insert({ user_id: user.id, event: failedUntil ? 'PASSWORD_CHANGE_LOCKED' : 'PASSWORD_CHANGE_FAILED' });
      if (auditError) console.error('Could not record failed password-change audit event.', auditError);
      if (failedUntil && new Date(failedUntil).getTime() > Date.now()) {
        return response({
          success: false,
          error: 'Đã nhập sai mật khẩu hiện tại 5 lần. Vui lòng thử lại sau 15 phút.',
          errorCode: 'LOCKED_OUT',
        });
      }
      return response({
        success: false,
        error: 'Mật khẩu hiện tại không chính xác.',
        errorCode: 'CURRENT_PASSWORD_INCORRECT',
      });
    }

    const { data: latestAuthData, error: latestAuthError } = await userClient.auth.getUser(token);
    if (latestAuthError || !latestAuthData.user ||
      latestAuthData.user.id !== user.id ||
      latestAuthData.user.app_metadata.must_change_password !== true ||
      latestAuthData.user.updated_at !== user.updated_at) {
      const { error: failedRequestError } = await serviceClient.from('first_password_change_requests')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('request_id', requestId);
      if (failedRequestError) console.error('Failed to persist the rejected password-change request.', failedRequestError);
      return response({ success: false, error: 'Phiên làm việc đã kết thúc. Vui lòng đăng nhập lại.', errorCode: 'SESSION_INVALID' });
    }

    const updatedAppMetadata = {
      ...user.app_metadata,
      must_change_password: false,
      auth_version: Number(user.app_metadata.auth_version ?? 0) + 1,
    };
    const { error: updateError } = await serviceClient.auth.admin.updateUserById(user.id, {
      password: newPassword,
      app_metadata: updatedAppMetadata,
      user_metadata: { ...user.user_metadata, must_change_password: false },
    });
    if (updateError) {
      const { error: failedRequestError } = await serviceClient.from('first_password_change_requests')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('request_id', requestId);
      if (failedRequestError) console.error('Failed to persist the unsuccessful password-change request.', failedRequestError);
      return response({ success: false, error: 'Không thể đổi mật khẩu lúc này. Vui lòng thử lại sau.', errorCode: 'UPDATE_FAILED' });
    }

    const { error: completedRequestError } = await serviceClient.from('first_password_change_requests')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('request_id', requestId);
    if (completedRequestError) console.error('Password changed, but request status could not be persisted.', completedRequestError);
    const { error: clearFailureError } = await serviceClient.from('password_change_security_state').delete().eq('user_id', user.id);
    if (clearFailureError) console.error('Password changed, but failed-attempt counters could not be cleared.', clearFailureError);
    const { error: auditError } = await serviceClient.from('auth_security_events')
      .insert({ user_id: user.id, event: 'FIRST_PASSWORD_CHANGE_SUCCESS' });
    if (auditError) console.error('Password changed, but the audit event could not be recorded.', auditError);

    const { error: revokeError } = await serviceClient.auth.admin.signOut(token, 'global');
    if (revokeError) {
      console.error('Password changed, but revoking the temporary session failed.', revokeError);
      return response({
        success: false,
        error: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại bằng mật khẩu mới.',
        errorCode: 'PASSWORD_UPDATED_RELOGIN',
      });
    }

    const { data: sessionData, error: sessionError } = await verificationClient.auth.signInWithPassword({
      email: user.email ?? '',
      password: newPassword,
    });
    if (sessionError || !sessionData.session) {
      if (sessionError) console.error('Password changed, but a new session could not be created.', sessionError);
      return response({
        success: false,
        error: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại bằng mật khẩu mới.',
        errorCode: 'PASSWORD_UPDATED_RELOGIN',
      });
    }

    return response({
      success: true,
      session: {
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
      },
    });
  } catch (error) {
    console.error('First-password-change request failed.', error);
    return response({
      success: false,
      error: 'Không thể đổi mật khẩu lúc này. Vui lòng thử lại sau.',
      errorCode: 'UPDATE_FAILED',
    }, 500);
  }
});
