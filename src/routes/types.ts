// 定义一个新的接口，包含所有我们需要的属性
export interface CustomRouteObject {
    caseSensitive?: boolean
    children?: CustomRouteObject[]
    element?: React.ReactNode
    index?: boolean
    path?: string
    label?: string
    icon?: React.ReactNode
    key: string
    fullPath?: string
    hideInMenu?: boolean
    hideInBreadcrumb?: boolean
}


