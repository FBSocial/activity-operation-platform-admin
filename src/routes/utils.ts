import type { MenuProps } from 'antd';
import { lowerCase } from 'es-toolkit';
import { adminRoutes } from './admin-routes';

type MenuItem = Required<MenuProps>['items'][number] & {
    fullPath: string
    children?: MenuItem[]
    [key: string]: unknown; // 允许任意自定义属性
};


export const BASE_ADMIN_PATH = '/admin';


export function generateMenuItems(routes: any[], parentPath: string = BASE_ADMIN_PATH): MenuItem[] {
    return routes
        .filter(route => !route.hideInMenu)
        .map(route => {
            const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/')

            const menuItem: MenuItem = {
                key: route.key || fullPath,
                icon: route.icon,
                label: route.label,
                title: route.label,
                fullPath: fullPath,
            }

            if (route.children) {
                menuItem.children = generateMenuItems(route.children, fullPath)
            }

            return menuItem
        })
}

// 高阶函数，用于将指定字段转换为 data- 开头的自定义字段
export function convertFieldsToDataAttributes(...fieldsToConvert: string[]) {
    return (menuItems: MenuItem[]): MenuItem[] => {
        return menuItems.map(menuItem => {
            const newMenuItem = { ...menuItem } as any;
            fieldsToConvert.forEach(field => {
                if (newMenuItem[field] !== undefined) {
                    const fileName = lowerCase(field)?.split(' ')?.join('')
                    newMenuItem[`data-meta-${fileName}`] = newMenuItem[field];
                    delete newMenuItem[field];
                }
            });
            if (menuItem.children) {
                newMenuItem.children = convertFieldsToDataAttributes(...fieldsToConvert)(menuItem.children);
            }
            return newMenuItem;
        });
    };
}

export const antdMenuItems = () => {
    const menuItems = generateMenuItems(adminRoutes);
    const fieldsToConvert = ['fullPath'];
    return convertFieldsToDataAttributes(...fieldsToConvert)(menuItems);
};

export function findMenuItemByKey(items: MenuItem[], key: string): MenuItem | null {
    for (const item of items) {
        if (item && 'key' in item) {
            if (item.key === key) {
                return item;
            }
            if (item.children) {
                const found = findMenuItemByKey(item.children, key);
                if (found) {
                    return found;
                }
            }
        }
    }
    return null;
}



/**
 * 根据当前路径查找菜单项的激活键
 *
 * @param {MenuItem[]} items - 菜单项数组
 * @param {string} pathname - 当前路径
 * @returns {{ openKeys: string[], selectedKeys: string[] }} - 包含打开键和选中键的对象
 */
export function findActiveKeys(items: MenuItem[], pathname: string): { openKeys: string[], selectedKeys: string[] } {
    const result = { openKeys: [] as string[], selectedKeys: [] as string[] };

    /**
     * 递归遍历菜单项
     *
     * @param {MenuItem[]} menuItems - 当前层级的菜单项数组
     * @param {string[]} parents - 当前菜单项的父级键数组
     * @returns {boolean} - 是否找到匹配的菜单项
     */
    function traverse(menuItems: MenuItem[], parents: string[] = []): boolean {
        for (const item of menuItems) {
            const currentPath = parents.concat(item.key as string);

            // 如果当前菜单项的完整路径与当前路径匹配，则设置打开键和选中键
            if (item['data-meta-fullpath'] === pathname) {
                result.openKeys = parents;
                result.selectedKeys = [item.key as string];
                return true;
            }

            // 如果有子菜单项，递归遍历子菜单项
            if (item.children) {
                if (traverse(item.children, currentPath)) {
                    return true;
                }
            }
        }

        return false;
    }

    // 开始遍历菜单项
    traverse(items);

    return result;
}