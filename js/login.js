(() => {
  const tabs = document.querySelectorAll('.tab');
  const forms = document.querySelectorAll('.form');

  // Tab 切换
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      forms.forEach(f => f.classList.toggle('active', f.dataset.form === target));
      // 清空上一个表单的提示
      document.querySelectorAll('.form-msg').forEach(m => { m.textContent = ''; m.className = 'form-msg'; });
    });
  });

  const setMsg = (form, text, type = 'error') => {
    const msg = form.querySelector('.form-msg');
    msg.textContent = text;
    msg.className = 'form-msg ' + type;
  };

  const validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  // 登录
  const loginForm = document.querySelector('[data-form="login"]');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm));
    if (!data.email || !data.password) return setMsg(loginForm, '请填写完整');
    if (!validEmail(data.email)) return setMsg(loginForm, '邮箱格式不正确');
    if (data.password.length < 6) return setMsg(loginForm, '密码至少 6 位');

    setMsg(loginForm, '登录中…', 'success');
    try {
      // TODO: 对接后端
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: data.email, password: data.password, remember: !!data.remember })
      // });
      // if (!res.ok) throw new Error('登录失败');
      // const { token } = await res.json();
      // localStorage.setItem('token', token);
      // location.href = '/app';
      await new Promise(r => setTimeout(r, 600));
      setMsg(loginForm, '演示模式：未对接后端', 'error');
    } catch (err) {
      setMsg(loginForm, err.message || '登录失败，请重试');
    }
  });

  // 注册
  const regForm = document.querySelector('[data-form="register"]');
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(regForm));
    if (!data.email || !data.password || !data.password2) return setMsg(regForm, '请填写完整');
    if (!validEmail(data.email)) return setMsg(regForm, '邮箱格式不正确');
    if (data.password.length < 6) return setMsg(regForm, '密码至少 6 位');
    if (data.password !== data.password2) return setMsg(regForm, '两次密码不一致');
    if (!data.agree) return setMsg(regForm, '请勾选同意用户协议');

    setMsg(regForm, '提交中…', 'success');
    try {
      // TODO: 对接后端
      // const res = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: data.email, password: data.password })
      // });
      // if (!res.ok) throw new Error('注册失败');
      await new Promise(r => setTimeout(r, 600));
      setMsg(regForm, '演示模式：未对接后端', 'error');
    } catch (err) {
      setMsg(regForm, err.message || '注册失败，请重试');
    }
  });
})();