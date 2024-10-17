/**
 * 替换字符串中的占位符。
 *
 * @param {string} content - 原始内容字符串。
 * @param {string[]} replacements - 用于替换占位符的值数组。
 * @param {RegExp | string | number} [placeholder=/x/g] - 占位符或正则表达式，默认为 /x/g。
 * @returns {string} - 替换占位符后的字符串。
 * @throws {Error} - 如果提供的替换值不足以替换所有占位符，或者占位符格式不正确。
 */
export function replacePlaceholders(
    content: string,
    replacements: string[],
    placeholder: RegExp | string | number = /x/g
): string {
    // 将数字占位符转换为字符串
    let pattern: RegExp;
    if (typeof placeholder === 'number') {
        placeholder = placeholder.toString();
    }

    // 确保 placeholder 是一个正则表达式
    if (placeholder instanceof RegExp) {
        pattern = placeholder;
    } else {
        pattern = new RegExp(escapeRegExp(placeholder as string), 'g');
    }

    // 检查是否有足够的替换值
    const matches = content.match(pattern);
    const matchCount = matches ? matches.length : 0;
    if (matchCount > replacements.length) {
        throw new Error(`提供的替换值不足以替换所有占位符。需要 ${matchCount} 个替换值，但只提供了 ${replacements.length} 个。`);
    }

    // 使用替换数组中的元素替换内容中的占位符
    let result = content;
    for (const replacement of replacements) {
        if (pattern.global) {
            // 全局替换
            result = result.replace(pattern, replacement);
        } else {
            // 只替换第一个匹配
            result = result.replace(pattern, replacement);
            break; // 只替换一次
        }
    }

    // 如果还有未被替换的占位符，则抛出错误
    if (pattern.global && pattern.test(result)) {
        const remainingMatches = result.match(pattern);
        const remainingMatchCount = remainingMatches ? remainingMatches.length : 0;
        throw new Error(`提供的替换值不足以替换所有占位符。剩余 ${remainingMatchCount} 个占位符未被替换。`);
    }

    return result;
}

// 辅助函数：转义特殊字符，以防止它们在正则表达式中被解释
function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 表示匹配到的内容本身
}
