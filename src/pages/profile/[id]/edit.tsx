import React, { useEffect, useState } from 'react';

// hooks
import { useRouter } from 'next/router';
import {
  useMutationProfileModify,
  useMutationUnRegister,
  useUserProfileQuery,
} from '@api/story/user';
import { useAlert } from '@hooks/useAlert';

// component
import Divider from '@mui/material/Divider';
// import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// custom components
import AppLayout from '@components/ui/layouts/AppLayout';
import ProfileEditTitle from '@components/profile/edit/ProfileEditTitle';
import SettingUserProfile from '@components/profile/edit/SettingUserProfile';
import SettingRow from '@components/profile/edit/SettingRow';
import { PAGE_ENDPOINTS } from '@constants/constant';

const ProfileEditPage = () => {
  const router = useRouter();
  const id = router.query.id?.toString();

  const { showAlert, Alert } = useAlert();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { data, isError, error, refetch } = useUserProfileQuery(id);
  const { mutateAsync: modifyMutate } = useMutationProfileModify();
  const { mutateAsync: unRegisterMutate } = useMutationUnRegister();

  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [open, setOpen] = useState(false);

  const onRefresh = () => refetch();

  useEffect(() => {
    if (!data) return;
    setGender(data.profile.gender);
  }, [data]);

  useEffect(() => {
    if (isError && error) {
      showAlert({
        content: {
          text: error.response?.data.message,
        },
        okHandler: () => router.back(),
        closeHandler: () => router.back(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]);

  const onChangeGender = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!id) return;
    const value = e.target.value as 'M' | 'F';
    await modifyMutate({
      dataId: Number(id),
      gender: value,
    });
    await refetch();
    setGender(value);
  };

  const onUnRegister = async () => {
    if (!id) return;
    await unRegisterMutate(id);
    router.replace(PAGE_ENDPOINTS.LOGIN);
  };

  const onOpen = () => setOpen(true);

  const onClose = () => setOpen(false);

  return (
    <>
      <div className="w-full box-border pt-8 px-8 pb-10 h-full">
        <div className="p-0 m-auto relative h-full">
          <div className="py-8 relative m-auto constrained-content h-full">
            <ProfileEditTitle nikcname={data?.profile?.nickname} />
            <SettingUserProfile profile={data?.profile} onRefresh={onRefresh} />
            <div className="mt-20 space-y-5">
              <SettingRow
                title="이메일 주소"
                description="회원 인증 또는 시스템에서 발송하는 이메일을 수신하는 주소입니다."
              >
                {data?.email}
              </SettingRow>
              <Divider />
              <SettingRow title="성별">
                <FormGroup>
                  <RadioGroup
                    row
                    value={gender}
                    aria-label="gender"
                    name="row-radio-buttons-group"
                    onChange={onChangeGender}
                  >
                    <FormControlLabel
                      value="F"
                      control={<Radio />}
                      label="여성"
                    />
                    <FormControlLabel
                      value="M"
                      control={<Radio />}
                      label="남성"
                    />
                  </RadioGroup>
                </FormGroup>
              </SettingRow>
              <Divider />
              {/* <SettingRow title="알림 수신 설정">
                <FormGroup>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="알림 수신 설정"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="알림 수신 설정"
                  />
                </FormGroup>
              </SettingRow> */}
              {/* <Divider /> */}
              <SettingRow
                title="회원탈퇴"
                description="탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다."
              >
                <Button variant="outlined" onClick={onOpen}>
                  회원탈퇴
                </Button>
              </SettingRow>
            </div>
          </div>
        </div>
      </div>
      <Alert />
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">회원탈퇴</DialogTitle>
        <DialogContent>
          <DialogContentText>
            회원을 탈퇴 하시겠습니까? 회원 탈퇴 후 3개월간 데이터 유지 후 완전한
            탈퇴 처리 됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onUnRegister}>
            확인
          </Button>
          <Button onClick={onClose} autoFocus>
            취소
          </Button>
        </DialogActions>
      </Dialog>
      <style jsx>{`
        .constrained-content {
          max-width: 878px;
        }
      `}</style>
    </>
  );
};

export default ProfileEditPage;

ProfileEditPage.Layout = AppLayout;
