/**
 * Really trivial types for PureCSS
 * I might want to commit these types to @types
 */
declare module "purecss" {
    function getFile(name: string): string;

    function getFilePath(name: string): string;
}
