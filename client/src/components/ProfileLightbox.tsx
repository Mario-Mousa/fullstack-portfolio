import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ProfileLightboxProps = {
  imageUrl?: string | null;
  name: string;
  title?: string;
  initials: string;
  className: string;
};

export default function ProfileLightbox({ imageUrl, name, title, initials, className }: ProfileLightboxProps) {
  return <Dialog>
    <DialogTrigger asChild>
      <button type="button" className={`profile-lightbox-trigger ${className}`} aria-label={`Open ${name || "profile"} photo`}>
        {imageUrl ? <img src={imageUrl} alt={name || "Profile"} /> : <span>{initials}</span>}
      </button>
    </DialogTrigger>
    <DialogContent className="profile-lightbox-content" aria-describedby="profile-lightbox-description">
      <DialogHeader className="profile-lightbox-header"><DialogTitle>{name || "Profile"}</DialogTitle><DialogDescription id="profile-lightbox-description">{title || "Full-stack developer"}</DialogDescription></DialogHeader>
      <div className="profile-lightbox-image">{imageUrl ? <img src={imageUrl} alt={name || "Profile"} /> : <span>{initials}</span>}<i /><i /></div>
    </DialogContent>
  </Dialog>;
}
