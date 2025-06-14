export abstract class ExpandedService<T> {    
    abstract sameItem(item1: T, item2: T): boolean;
}