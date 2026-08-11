import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk, withBackendAuth } from '../../../server/http';
import * as social from '../../../server/services/socialService';

/**
 * POST /api/backend/social
 * Body: { action: string, ...params }
 * Auth: Bearer Firebase ID token
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const auth = await withBackendAuth(req, res, {
        methods: ['POST'],
        rateKey: 'social',
        limit: 200,
    });
    if (!auth) return;

    const { user, token } = auth;
    const action = String(req.body?.action || '');

    try {
        switch (action) {
            case 'ensureProfile': {
                const data = await social.ensureProfile(token, user.uid, {
                    name: req.body?.name,
                    photoURL: req.body?.photoURL,
                });
                return sendOk(res, data);
            }
            case 'getProfile': {
                const uid = String(req.body?.uid || user.uid);
                const data = await social.getProfile(token, uid);
                return sendOk(res, data);
            }
            case 'updateProfile': {
                const data = await social.updateProfile(token, user.uid, {
                    username: req.body?.username,
                    bio: req.body?.bio,
                    displayName: req.body?.displayName,
                    showXp: req.body?.showXp,
                });
                return sendOk(res, data);
            }
            case 'listProfiles': {
                const data = await social.listProfiles(token, Number(req.body?.limit) || 30);
                return sendOk(res, data);
            }
            case 'listFeed': {
                const data = await social.listFeed(token, Number(req.body?.limit) || 40);
                return sendOk(res, data);
            }
            case 'createPost': {
                const me = await social.ensureProfile(token, user.uid);
                const data = await social.createPost(token, me, String(req.body?.text || ''));
                return sendOk(res, data, 201);
            }
            case 'toggleLike': {
                const data = await social.toggleLike(token, String(req.body?.postId || ''), user.uid);
                return sendOk(res, data);
            }
            case 'hasLiked': {
                const liked = await social.hasLiked(token, String(req.body?.postId || ''), user.uid);
                return sendOk(res, { liked });
            }
            case 'addComment': {
                const me = await social.ensureProfile(token, user.uid);
                const data = await social.addComment(
                    token,
                    String(req.body?.postId || ''),
                    me,
                    String(req.body?.text || '')
                );
                return sendOk(res, data, 201);
            }
            case 'listComments': {
                const data = await social.listComments(token, String(req.body?.postId || ''));
                return sendOk(res, data);
            }
            case 'follow': {
                await social.follow(token, user.uid, String(req.body?.uid || ''));
                return sendOk(res, { following: true });
            }
            case 'unfollow': {
                await social.unfollow(token, user.uid, String(req.body?.uid || ''));
                return sendOk(res, { following: false });
            }
            case 'isFollowing': {
                const following = await social.isFollowing(token, user.uid, String(req.body?.uid || ''));
                return sendOk(res, { following });
            }
            case 'listFollowingIds': {
                const data = await social.listFollowingIds(token, user.uid);
                return sendOk(res, data);
            }
            case 'createGroup': {
                const me = await social.ensureProfile(token, user.uid);
                const data = await social.createGroup(
                    token,
                    me,
                    String(req.body?.name || ''),
                    String(req.body?.description || ''),
                    String(req.body?.topic || '')
                );
                return sendOk(res, data, 201);
            }
            case 'listGroups': {
                const data = await social.listGroups(token);
                return sendOk(res, data);
            }
            case 'joinGroup': {
                await social.joinGroup(token, String(req.body?.groupId || ''), user.uid);
                return sendOk(res, { joined: true });
            }
            case 'leaveGroup': {
                await social.leaveGroup(token, String(req.body?.groupId || ''), user.uid);
                return sendOk(res, { left: true });
            }
            case 'sendMessage': {
                const me = await social.ensureProfile(token, user.uid);
                const toUid = String(req.body?.toUid || '');
                const to = await social.getProfile(token, toUid);
                if (!to) throw new Error('Címzett nem található.');
                await social.sendMessage(token, me, to, String(req.body?.text || ''));
                return sendOk(res, { sent: true });
            }
            case 'listConversations': {
                const data = await social.listConversations(token, user.uid);
                return sendOk(res, data);
            }
            case 'listMessages': {
                const data = await social.listMessages(token, String(req.body?.conversationId || ''));
                return sendOk(res, data);
            }
            default:
                return sendErr(res, `Ismeretlen action: ${action}`, 400);
        }
    } catch (e: any) {
        console.error('backend/social', action, e);
        return sendErr(res, e?.message || 'Backend hiba', 500);
    }
}
