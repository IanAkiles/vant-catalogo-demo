export const appBase=import.meta.env?.BASE_URL||'/';
export function isAdminPath(path,base=appBase){
 return path.replace(/\/+$/,'')===`${base}admin`||path===`${base}admin/index.html`;
}
