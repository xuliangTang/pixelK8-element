import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/cluster',
    component: Layout,
    redirect: '/cluster/nodes',
    name: 'Example',
    meta: { title: '集群', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'nodes',
        name: 'Nodes',
        component: () => import('@/views/cluster/nodeList'),
        meta: { title: 'Nodes', icon: 'table' }
      },
      {
        path: 'node-show',
        name: 'Node-show',
        component: () => import('@/views/cluster/nodeShow'),
        meta: { title: 'node详情' },
        hidden: true
      },
      {
        path: 'node-edit',
        name: 'Node-edit',
        component: () => import('@/views/cluster/nodeEdit'),
        meta: { title: '编辑node' },
        hidden: true
      },
      {
        path: 'namespaces',
        name: 'Namespaces',
        component: () => import('@/views/cluster/nsList'),
        meta: { title: 'Namespaces', icon: 'table' }
      },
      {
        path: 'node-terminal',
        name: 'Node-terminal',
        component: () => import('@/views/cluster/nodeTerminal'),
        meta: { title: 'Pod终端' },
        hidden: true
      }
    ]
  },
  {
    path: '/workloads',
    component: Layout,
    redirect: '/workloads/deployments',
    name: 'Example',
    meta: { title: '工作负载', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'deployments',
        name: 'Deployments',
        component: () => import('@/views/workloads/depList'),
        meta: { title: 'Deployments', icon: 'table' }
      },
      {
        path: 'pods',
        name: 'Pods',
        component: () => import('@/views/workloads/podList'),
        meta: { title: 'Pods', icon: 'tree' }
      },
      {
        path: 'pod-log',
        name: 'Pod-log',
        component: () => import('@/views/workloads/podLog'),
        meta: { title: 'Pod日志' },
        hidden: true
      },
      {
        path: 'pod-terminal',
        name: 'Pod-terminal',
        component: () => import('@/views/workloads/podTerminal'),
        meta: { title: 'Pod终端' },
        hidden: true
      }
    ]
  },

  {
    path: '/service-discovery',
    component: Layout,
    redirect: '/service-discovery/ingress',
    name: 'Example',
    meta: { title: '服务发现', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'ingress',
        name: 'Ingress',
        component: () => import('@/views/service-discovery/ingressList'),
        meta: { title: 'Ingress', icon: 'table' }
      },
      {
        path: 'services',
        name: 'Services',
        component: () => import('@/views/service-discovery/serviceList'),
        meta: { title: 'Services', icon: 'tree' }
      },
      {
        path: 'ingress-create',
        name: 'Ingress-create',
        component: () => import('@/views/service-discovery/ingressCreate'),
        meta: { title: '编辑ingress' },
        hidden: true
      }
    ]
  },

  {
    path: '/storage',
    component: Layout,
    redirect: '/storage/secrets',
    name: 'rbac',
    meta: { title: '存储', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'secrets',
        name: 'Secrets',
        component: () => import('@/views/storage/secretList'),
        meta: { title: 'Secrets', icon: 'table' }
      },
      {
        path: 'secret-create',
        name: 'Secret-create',
        component: () => import('@/views/storage/secretCreate'),
        meta: { title: '编辑secret' },
        hidden: true
      },
      {
        path: 'secret-show',
        name: 'Secret-show',
        component: () => import('@/views/storage/secretShow'),
        meta: { title: 'secret详情' },
        hidden: true
      },
      {
        path: 'configmaps',
        name: 'Configmaps',
        component: () => import('@/views/storage/configmapList'),
        meta: { title: 'Configmaps', icon: 'tree' }
      },
      {
        path: 'configmap-create',
        name: 'Configmap-create',
        component: () => import('@/views/storage/configmapCreate'),
        meta: { title: '编辑configmap' },
        hidden: true
      },
      {
        path: 'configmap-show',
        name: 'Configmap-show',
        component: () => import('@/views/storage/configmapShow'),
        meta: { title: 'configmap详情' },
        hidden: true
      }
    ]
  },

  {
    path: '/rbac',
    component: Layout,
    redirect: '/rbac/roles',
    name: 'Example',
    meta: {title: 'RBAC', icon: 'el-icon-s-help'},
    children: [
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/rbac/roleList'),
        meta: {title: 'Roles', icon: 'table'}
      },
      {
        path: 'role-create',
        name: 'Role-create',
        component: () => import('@/views/rbac/roleCreate'),
        meta: {title: '编辑Role', icon: 'table'},
        hidden: true
      },
      {
        path: 'cluster-roles',
        name: 'Cluster-roles',
        component: () => import('@/views/rbac/clusterRoleList'),
        meta: {title: 'ClusterRoles', icon: 'table'}
      },
      {
        path: 'rolebindings',
        name: 'Rolebindings',
        component: () => import('@/views/rbac/roleBindingList'),
        meta: {title: 'RoleBindings', icon: 'table'}
      },
      {
        path: 'rolebinding-create',
        name: 'Rolebinding-create',
        component: () => import('@/views/rbac/roleBindingCreate'),
        meta: {title: '编辑RoleBinding', icon: 'table'},
        hidden: true
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
