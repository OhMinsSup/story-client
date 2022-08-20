import React, { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// compoents
import { LoginSeo } from '@components/ui/Seo';
import { Layout } from '@components/ui/Layout';
import { KlaytnIcon } from '@components/ui/Icon';
import {
  Button,
  Container,
  Divider,
  Group,
  Text,
  FileButton,
} from '@mantine/core';

// hooks
import { useLoginMutation } from '@api/mutations';
import { useRouter } from 'next/router';
import { useAtomValue } from 'jotai';

// atom
import { authAtom } from '@atoms/authAtom';

// constants
import { PAGE_ENDPOINTS } from '@constants/constant';
import { LoginForm } from '@components/auth';

// dynamic
const LoginKeystorePopup = dynamic(
  () => import('@components/auth/LoginKeystorePopup'),
);

const LoginPage = () => {
  const router = useRouter();
  const isAuthication = useAtomValue(authAtom);
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const { mutate, isLoading } = useLoginMutation();

  const onCloseModal = useCallback(() => {
    setFile(null);
    resetRef.current?.();
  }, []);

  if (isAuthication) {
    router.replace(PAGE_ENDPOINTS.INDEX);
  }

  return (
    <Layout>
      <LoginSeo />
      <Container size={420} my={40}>
        <Text size="lg" weight={700}>
          Story
        </Text>
        <Text weight={400}>에 로그인하세요.</Text>

        <Group grow mb="md" mt="md">
          <FileButton
            resetRef={resetRef}
            onChange={setFile}
            accept=".json,application/json"
          >
            {(props) => (
              <Button
                leftIcon={<KlaytnIcon className="w-5 h-5 fill-current" />}
                variant="default"
                color="gray"
                radius="xl"
                {...props}
              >
                Keystore
              </Button>
            )}
          </FileButton>
        </Group>
        <Divider label="Or" labelPosition="center" my="lg" />
        <LoginForm isLoading={isLoading} submit={mutate} />
        <LoginKeystorePopup payload={file} onClose={onCloseModal} />
      </Container>
    </Layout>
  );
};

export default LoginPage;
