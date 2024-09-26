// 分类相关的数据ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的ts类型:需要修改
export interface SpuData {
  category3Id: number | string
  id?: number
  spuName: string
  description: string
  tmId: number | string
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImg[]
  spuPosterList: null
}

// 数组：元素都是已有SPU数据类型
export type Recodes = SpuData[]

// 获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Recodes
    total: number
    size: number
    current: number
    pages: number
    searchCount: boolean
  }
}
// 所有品牌数据的ts类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
// 品牌接口返回数据的ts类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片的ts类型
export interface SpuImg {
  id?: number
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}
// 已有的SPU的照片墙数据的类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性的属性值对象的ts类型
export interface SaleAttrValue {
  id?: number
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string | undefined
  saleAttrName?: string
  isChecked?: null
}
// 存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象ts类型
export interface SaleAttr {
  id?: number
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// SPU已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

//已有的全部SPU的返回数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface Attr {
  attrId: number | string //平台属性的ID
  valueId: number | string //属性值的ID
}
export interface saleArr {
  saleAttrId: number | string //属性ID
  saleAttrValueId: number | string //属性值的ID
}

export interface SkuData {
  category3Id: string | number //三级分类的ID
  spuId: string | number //已有的SPU的ID
  tmId: string | number //SPU品牌的ID
  skuName: string //sku名字
  price: string | number //sku价格
  weight: string | number //sku重量
  skuDesc: string //sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg: string //sku图片地址
}

//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
