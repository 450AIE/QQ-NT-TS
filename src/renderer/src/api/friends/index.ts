import http from "@renderer/utils/http/http";

export function applyForBeingFriendAPI(friend_id: stirng, remarks: stirng, description: string, caller_id: string, device_id: string) {
    return http({
        url: '/v1/friend/add',
        method: 'POST',
        data: {
            friend_id,
            remarks,
            description
            // caller_id,
            // device_id
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
}

export function getFriendApplicationListAPI() {
    return http({
        url: '/v1/friend/add-list',
        method: 'POST',
        data: {
            // caller_id,
            // device_id
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
}

export function agreeFriendApplicationAPI(friend_id: stirng, remarks?: stirng) {
    return http({
        url: '/v1/friend/agree',
        method: 'POST',
        data: {
            friend_id,
            remarks
            // caller_id, device_id
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
}

export function setFriendInfoAPI(friend_id: stirng, remarks: stirng, extra: string, caller_id: string, device_id: string) {
    return http({
        url: '/v1/friend/set',
        method: 'POST',
        data: {
            friend_id,
            remarks,
            extra,
            // caller_id,
            // device_id
        }
    })
}

export function getAllFriendsInfoAPI() {
    return http({
        url: "/v1/friend/all",
        method: 'POST',
        data: {
            // caller_id,
            // device_id
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
}

