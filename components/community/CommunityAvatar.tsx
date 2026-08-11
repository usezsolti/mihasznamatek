export type CommunityAvatarProps = {
    url?: string;
    name: string;
    size?: number;
};

export default function CommunityAvatar({
    url,
    name,
    size = 40,
}: CommunityAvatarProps) {
    if (url) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img className="mm-social-avatar" style={{ width: size, height: size }} src={url} alt="" />;
    }
    return (
        <span
            className="mm-social-avatar mm-social-avatar-fallback"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
            aria-hidden
        >
            {(name[0] || '?').toUpperCase()}
        </span>
    );
}
