export const checkAuth = () => {
    // 这里可以替换为实际的鉴权逻辑
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('role') || 'guest'; // 假设有 'admin' 和 'user' 两种角色
    return { isAuthenticated, role };
};
