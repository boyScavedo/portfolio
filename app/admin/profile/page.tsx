import Link from "next/link";
import { getProfile } from "@/lib/profile";
import ProfileForm from "./profile-form";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-[#555] hover:text-[#d4f600] transition-colors">← Admin</Link>
        <h1 className="text-2xl font-bold mt-1">Profile & Status</h1>
        <p className="text-sm text-[#555] mt-1">Controls what appears on your homepage, about page, and hero section.</p>
      </div>
      <ProfileForm initial={profile} />
    </div>
  );
}
