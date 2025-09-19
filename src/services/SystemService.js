class SystemService {
    constructor(userManager, bookManager, authManager) {
      this.userManager = userManager;
      this.bookManager = bookManager;
      this.authManager = authManager;
    }
  
    /**
     * 获取系统统计信息
     * @returns {Object} 系统统计信息
     */
    getSystemStats() {
      const authResult = this.authManager.checkLogin();
      if (!authResult.success) {
        return { error: authResult.message };
      }
  
      const userStats = this.userManager.getRoleStats();
      
      return {
        totalBooks: this.bookManager.getTotalBooks(),
        totalUsers: this.userManager.getTotalUsers(),
        userStats: userStats,
        currentUser: authResult.user.name,
        currentUserRole: authResult.user.role
      };
    }
  
    /**
     * 系统健康检查
     * @returns {Object} 系统健康状态
     */
    healthCheck() {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          userManager: this.userManager ? 'active' : 'inactive',
          bookManager: this.bookManager ? 'active' : 'inactive',
          authManager: this.authManager ? 'active' : 'inactive'
        }
      };
    }
  
    /**
     * 获取系统配置信息
     * @returns {Object} 系统配置
     */
    getSystemConfig() {
      const authResult = this.authManager.checkLogin();
      if (!authResult.success) {
        return { error: authResult.message };
      }
  
      // 只有管理员可以查看详细配置
      const currentUser = authResult.user;
      if (currentUser.role !== 'admin') {
        return { error: '权限不足，无法查看系统配置' };
      }
  
      return {
        version: '1.0.0',
        environment: 'development',
        features: {
          userRegistration: true,
          bookManagement: true,
          borrowingSystem: true,
          userProfiles: true
        }
      };
    }
  }
  
  module.exports = SystemService;