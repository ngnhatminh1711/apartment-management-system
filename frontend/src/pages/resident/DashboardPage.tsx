import { useEffect, useState } from "react";
import ApartmentInfo from "./Profile/ApartmentInfo";
import BuildingInfo from "./Profile/BuildingInfo";
import PersonalCard from "./Profile/PersonalCard";
import ResidentSectionList from "./Profile/ResidentSectionList";
import type { ApartmentBuilding, Profile } from "../../types/apartment";
import ProfileService from "../../services/resident/ProfileService";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/common/ToastContainer";
import UpdateInfo from "./Profile/UpdateInfo";
import ChangePassword from "./Profile/ChangePassword";
import { authService } from "../../services/authService";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "../../types/auth";
export function ResidentDashboardPage() {
  const [dataProfile, setDataProfile] = useState<Profile>();
  const [dataApartment, setDataApartment] = useState<ApartmentBuilding>();
  const toast = useToast();
  const [updateProfile, setUpdateProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const handleUpdateProfile = async (payload: UpdateProfileRequest) => {
    try {
      await ProfileService.updateProfile(payload);
      toast.success("Cập nhật hồ sơ thành công!");
      setUpdateProfile(false);
      await fetchData();
    } catch (e: any) {
      const status = e?.response?.status;
      const code = e?.response?.data?.errorCode || e?.response?.data?.code;

      if (status === 409 && code === "PHONE_ALREADY_EXISTS") {
        toast.error("Số điện thoại đã được sử dụng trong hệ thống.");
        return;
      }

      const msg =
        e?.response?.data?.message ||
        code ||
        e?.message ||
        "Có lỗi xảy ra khi cập nhật hồ sơ";
      toast.error(msg);
    }
  };
  const handleChangePassword = async (payload: ChangePasswordRequest) => {
    try {
      await authService.changePassword(payload);
      toast.success("Đổi mật khẩu thành công!");
      setChangePassword(false);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.errorCode ||
        e?.response?.data?.code ||
        e?.message ||
        "Có lỗi xảy ra khi đổi mật khẩu";
      toast.error(msg);
      toast.error("Đổi mật khẩu thất bại!");
    }
  };
  const fetchData = async () => {
    try {
      const resProfile = await ProfileService.getProfile();
      setDataProfile(resProfile);
      const resApartment = await ProfileService.getApartmentInfo();
      setDataApartment(resApartment);
      toast.success("Tải thông tin cá nhân thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải thông tin cá nhân!");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <main>
      <div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Căn hộ {dataApartment?.apartmentNumber} - Tòa{" "}
              {dataApartment?.building?.name}
            </h2>
            <p className="text-slate-500 mt-1">
              Thông tin chi tiết về căn hộ và ban quản lý tòa nhà
            </p>
          </div>
        </div>

        <div className=" mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {dataApartment && <ApartmentInfo data={dataApartment} />}
            {dataApartment && <ResidentSectionList data={dataApartment} />}
            {dataProfile && (
              <PersonalCard
                data={dataProfile}
                onUpdate={() => setUpdateProfile(true)}
                onChangePassword={() => setChangePassword(true)}
              />
            )}
          </div>

          <div className="space-y-8">
            {dataApartment && <BuildingInfo data={dataApartment} />}
          </div>
        </div>
      </div>
      {updateProfile && dataProfile && (
        <UpdateInfo
          onClose={() => setUpdateProfile(false)}
          profile={dataProfile}
          handleSubmit={handleUpdateProfile}
        />
      )}
      {changePassword && (
        <ChangePassword
          onClose={() => setChangePassword(false)}
          handleChange={handleChangePassword}
        />
      )}
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </main>
  );
}
