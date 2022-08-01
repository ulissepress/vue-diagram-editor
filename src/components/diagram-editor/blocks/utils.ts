import { Item } from "../types";

export function cssBorder(item: Item) : string {
    return item.border.width + 'px ' + item.border.style + ' ' + item.border.color
}

export function cssShadow(item: Item) : string {
    return item.shadow.enabled ? `${item.shadow.offsetX}px ${item.shadow.offsetY}px ${item.shadow.blur}px ${item.shadow.color}` : 'none'
}

export function cssDropShadow(item: Item) : string {
    return item.shadow.enabled ? `drop-shadow(${item.shadow.offsetX}px ${item.shadow.offsetY}px ${item.shadow.blur}px ${item.shadow.color})` : '' 
}
