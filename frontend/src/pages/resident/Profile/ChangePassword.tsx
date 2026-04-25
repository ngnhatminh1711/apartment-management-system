import { useState } from "react";
import type { FormEvent } from "react";
import type { ChangePasswordRequest } from "../../../types/auth";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/ToastContainer";
type Props = {
  onClose: () => void;
  handleChange: (payload: ChangePasswordRequest) => Promise<void>;
};

const ChangePassword = ({ onClose, handleChange }: Props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toast = useToast();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Xác nhận mật khẩu mới không khớp.");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("Mật khẩu mới không được trùng mật khẩu hiện tại.");
      return;
    }

    try {
      await handleChange({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-140 rounded-xl shadow-2xl overflow-hidden border border-outline">
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-outline p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-error-container text-error rounded-lg flex items-center justify-center">
                <span
                  className="material-symbols-outlined"
                  data-icon="lock_reset"
                >
                  lock_reset
                </span>
              </div>
              <h2 className="text-xl font-bold text-on-surface">
                Đổi mật khẩu
              </h2>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 rounded-lg bg-surface-variant border-transparent focus:border-primary focus:ring-0 focus:bg-white transition-all text-on-surface"
                    placeholder="••••••••"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-primary"
                    type="button"
                  >
                    <span
                      className="material-symbols-outlined"
                      data-icon="visibility"
                    >
                      {showCurrentPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="h-px bg-outline/50 my-2"></div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 rounded-lg bg-surface-variant border-transparent focus:border-primary focus:ring-0 focus:bg-white transition-all text-on-surface"
                    placeholder="••••••••"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-primary"
                    type="button"
                  >
                    <span
                      className="material-symbols-outlined"
                      data-icon="visibility"
                    >
                      {showNewPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 rounded-lg bg-surface-variant border-transparent focus:border-primary focus:ring-0 focus:bg-white transition-all text-on-surface"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-primary"
                    type="button"
                  >
                    <span
                      className="material-symbols-outlined"
                      data-icon="visibility"
                    >
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50 border-t border-outline flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Huỷ
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-white font-bold text-sm rounded-lg shadow-lg hover:brightness-110"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </div>
  );
};

export default ChangePassword;
