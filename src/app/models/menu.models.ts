export interface MenuImage {
  imageId: string | null;
  restaurantId: string | null;
  accountId: string | null;
  pageId: string | null;
  blockId: string | null;
  menuId: string | null;
  width: number;
  height: number;
  path: string | null;
  url: string | null;
  alt: string | null;
  thumbnailUrl: string | null;
  lastUpdateAt: number | null;
  createdAt: number | null;
}

export interface DynamicBlock {
  blockId: string;
  restaurantId: string;
  accountId: string;
  pageId: string;
  menuId: string;
  linkedPageId: string | null;
  type: 'title' | 'dish' | 'separator' | 'text' | 'image';
  title: string;
  titleSize: string | null;
  description: string;
  price: number;
  currency: string;
  status: string;
  sortingIndex: number | null;
  lastUpdateAt: number;
  createdAt: number;
  image: MenuImage | null;
}

export interface DynamicBlockEntry {
  dynamicBlock: DynamicBlock;
  dynamicImage: MenuImage[];
}

export interface DynamicPage {
  pageId: string;
  restaurantId: string;
  accountId: string;
  menuId: string;
  title: string;
  sortingIndex: number;
  isPrimary: boolean;
  status: string;
  blockIds: string[];
  lastUpdateAt: number;
  createdAt: number;
}

export interface DynamicPageEntry {
  dynamicPage: DynamicPage;
  dynamicBlocks: DynamicBlockEntry[];
}

export interface DynamicMenu {
  menuId: string;
  restaurantId: string;
  accountId: string;
  type: string;
  primaryPageId: string | null;
  pageIds: string[];
  name: string;
  url: string;
  iconsPosition: string | null;
  imgUrl: string | null;
  description: string;
  lastUpdateAt: number;
  createdAt: number;
  minLengthUrl: number;
  publicationStatus: number;
  welcomeImageStatus: number;
  statisticsLevel: number;
  welcomeImage: boolean;
  qRCodeCustomizing: boolean;
  qrCodeLogo: string | null;
}

export interface SeparatorConfig {
  size: string;
  style: string;
  width: string;
  customWidth: number;
  color: string;
  marginTop: number;
  marginBottom: number;
  label: string;
  labelPosition: string;
}

export interface MenuData {
  dynamicMenu: DynamicMenu;
  dynamicPages: DynamicPageEntry[];
}
