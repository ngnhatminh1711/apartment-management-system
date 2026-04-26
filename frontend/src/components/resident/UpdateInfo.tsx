import { useState } from "react";
import type { Profile } from "../../types/apartment";
import type { UpdateProfileRequest } from "../../types/auth";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../common/ToastContainer";
type Props = {
  onClose: () => void;
  profile: Profile;
  handleSubmit: (data: UpdateProfileRequest) => Promise<void>;
};

const UpdateInfo = ({ onClose, profile, handleSubmit }: Props) => {
  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
  );
  const toast = useToast();
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");

  const onSubmit = async () => {
    if (!fullName.trim()) {
      toast.error("Họ và tên không được để trống.");
      return;
    }
    const payload: UpdateProfileRequest = {
      fullName: fullName.trim(),
      phone: phone.trim() || null,
      dateOfBirth: dateOfBirth || null,
      avatarUrl: avatarUrl.trim() || null,
    };
    try {
      await handleSubmit(payload);
    } catch {
      toast.error("Lỗi khi cập nhật hồ sơ");
    } finally {
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-140 rounded-xl shadow-2xl overflow-hidden border border-outline">
        <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-outline p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Cập nhật hồ sơ
              </h2>
              <p className="text-sm text-slate-600 mt-1 italic">
                Thông tin cá nhân được sử dụng cho các thủ tục hành chính tại
                tòa nhà.
              </p>
            </div>
            <span
              className="material-symbols-outlined text-primary/40 text-3xl"
              data-icon="manage_accounts"
            >
              manage_accounts
            </span>
          </div>
          <form className="space-y-6">
            <div className="flex items-center gap-8 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-container shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <img
                    alt="Avatar Resident"
                    className="w-full h-full object-cover"
                    data-alt="close-up portrait of a woman with black hair smiling gently, soft natural lighting, high-end photography style"
                    src={avatarUrl}
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="photo_camera"
                  >
                    photo_camera
                  </span>
                  <input className="hidden" type="file" />
                </label>
              </div>
              <div className="flex-1">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center group cursor-pointer hover:border-primary transition-all">
                  <span
                    className="material-symbols-outlined text-slate-400 group-hover:text-primary group-hover:scale-110 transition-transform block mb-1"
                    data-icon="upload_file"
                  >
                    upload_file
                  </span>
                  <p className="text-xs text-slate-500">
                    Nhập đường link (URL) ảnh đại diện mới
                  </p>
                  <input
                    className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary focus:ring-0 focus:bg-white transition-all text-slate-900 font-medium"
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Họ và tên
                </label>
                <input
                  className="w-full h-12 px-4 rounded-lg bg-slate-50 border-transparent focus:border-primary focus:ring-0 focus:bg-white transition-all text-slate-900 font-medium"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Số điện thoại
                </label>
                <input
                  className="w-full h-12 px-4 rounded-lg bg-slate-50 border-transparent focus:border-primary focus:ring-0 focus:bg-white transition-all text-slate-900 font-medium"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Ngày sinh
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 rounded-lg bg-slate-50 border-transparent focus:border-primary focus:ring-0 focus:bg-white transition-all text-slate-900 font-medium appearance-none"
                    type="date"
                    value={dateOfBirth}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                  <span
                    className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none"
                    data-icon="calendar_month"
                  >
                    calendar_month
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 italic">
              Email và CCCD không thể tự chỉnh sửa. Vui lòng liên hệ Admin nếu
              cần thay đổi.
            </p>
            <div className="px-8 py-6 bg-slate-50 border-t border-outline flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Huỷ
              </button>

              <button
                type="button"
                onClick={onSubmit}
                className="px-8 py-3 bg-primary text-white font-bold text-sm rounded-lg shadow-lg hover:brightness-110"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </div>
  );
};

export default UpdateInfo;
