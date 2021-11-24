import { useMutation } from 'react-query';
import shallow from 'zustand/shallow';

// api
import { api } from '@api/module';

// no components
import {
  API_ENDPOINTS,
  RESULT_CODE,
  STATUS_CODE,
  STORAGE_KEY,
} from '@constants/constant';
import { isAxiosError } from '@utils/utils';

// store
import { useStore } from '@store/store';

// types
import type {
  LoginInput,
  LoginSchema,
  StoryErrorApi,
  StoryApi,
} from 'types/story-api';

export function useMutationLogin() {
  const { setAuth } = useStore(
    ({ actions }) => ({
      setAuth: actions?.setAuth,
    }),
    shallow,
  );

  const fetcher = (input: LoginInput) =>
    api.postResponse({
      url: API_ENDPOINTS.LOCAL.AUTH.LOGIN,
      body: input,
    });

  const mutation = useMutation<
    StoryApi<LoginSchema>,
    StoryErrorApi<null>,
    LoginInput
  >(fetcher, {
    mutationKey: API_ENDPOINTS.LOCAL.AUTH.LOGIN,
    onSuccess: (data, variable) => {
      const {
        data: { result, resultCode },
      } = data;

      if (RESULT_CODE.OK === resultCode && typeof result === 'object') {
        const { accessToken, ...user } = result;
        // 로그인 성공
        localStorage.setItem(STORAGE_KEY.USER_KEY, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEY.TOKEN_KEY, accessToken);
        setAuth?.(user);
      }
    },
  });

  return mutation;
}
