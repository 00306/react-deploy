import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchInstance } from '@/api/instance';
import { ApiPath } from '@/routes/path';
import { authSessionStorage } from '@/utils/storage';

export const useAuth = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('test');
  const [queryParams] = useSearchParams();

  const redirectAfterAuth = () => {
    if (!id || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    const redirectUrl = queryParams.get('redirect') ?? `${window.location.origin}/`;
    return window.location.replace(redirectUrl);
  };

  const login = async () => {
    if (!id || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetchInstance.post(ApiPath.members.login, {
        email: id,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        console.log('로그인 성공:', response);
        authSessionStorage.set(data.token);
        redirectAfterAuth();
      } else {
        console.error('로그인 실패:', response.statusText, response.status);
      }
    } catch (error) {
      console.error('로그인 요청 오류:', error);
      console.log(error);
    }
  };

  const register = async () => {
    if (!id || !password || !name) {
      alert('이메일, 비밀번호, 이름을 입력해주세요.');
      return;
    }

    try {
      const response = await fetchInstance.post(ApiPath.members.register, {
        email: id,
        password,
        name,
        loginType: 'NORMAL',
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('회원가입 성공:', data);
        authSessionStorage.set(response.data.token);
        redirectAfterAuth();
      } else {
        console.error('회원가입 실패:', response.statusText);
      }
    } catch (error) {
      console.error('회원가입 요청 오류:', error);
    }
  };

  return {
    id,
    setId,
    password,
    setPassword,
    name,
    setName,
    login,
    register,
  };
};
