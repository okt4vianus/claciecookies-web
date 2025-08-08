type AvatarProps = {
  src?: string;
  alt: string;
  size?: string;
  className?: string;
};

export function Avatar({
  src,
  alt,
  size = "w-8 h-8",
  className = "",
}: AvatarProps) {
  const fallbackUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${alt}`;

  return (
    <img
      src={src || fallbackUrl}
      alt={alt}
      className={`rounded-full object-cover ${size} ${className}`}
    />
  );
}
