import type { Profile } from "../../../types/apartment";

type Props = {
  data: Profile;
  onUpdate: () => void;
  onChangePassword: () => void;
};
const PersonalCard = ({ data, onUpdate, onChangePassword }: Props) => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 bg-primary/5 flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Thông tin cá nhân người dùng
        </h3>
        {data?.roles?.map((role, index) => (
          <span
            key={index}
            className="px-2.5 py-1 bg-primary text-white text-[10px] font-black uppercase rounded"
          >
            {role}
          </span>
        ))}
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-black text-primary">
            {data?.avatarUrl ? (
              <img
                src={data?.avatarUrl}
                alt="Avatar"
                className="size-full object-cover rounded-2xl"
              />
            ) : (
              <span className="material-symbols-outlined">person</span>
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Họ và tên
              </p>
              <p className="font-bold text-lg text-slate-900">
                {data?.fullName}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Email
              </p>
              <p className="font-semibold">{data?.email}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Số điện thoại
              </p>
              <p className="font-semibold text-primary">{data?.phone}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Số CCCD
              </p>
              <p className="font-semibold">{data?.idCard}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Ngày sinh
              </p>
              <p className="font-semibold">
                {data?.dateOfBirth
                  ? new Date(data.dateOfBirth).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div className="text-right flex items-end justify-end">
              <button
                onClick={onChangePassword}
                className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
              >
                Đổi mật khẩu
              </button>

              <button
                onClick={onUpdate}
                className="ml-10 text-primary text-xs font-bold flex items-center gap-1 hover:underline"
              >
                Cập nhật thông tin
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalCard;
