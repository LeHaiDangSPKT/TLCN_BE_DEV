import { CreateProductDto } from "src/product/dto/create-product.dto"

export const productStub = (): CreateProductDto => {
    return {
        avatar: ["https://cdn.chotot.com/73GnbjjK8aVmZ6DjP6kM-1N1OdweatFmGqIsBMMBVNw/preset:listing/plain/5b4b09466d0aec5cd5b7687896039e80-2855197324477878235.jpg",
            "https://cdn.chotot.com/73GnbjjK8aVmZ6DjP6kM-1N1OdweatFmGqIsBMMBVNw/preset:listing/plain/5b4b09466d0aec5cd5b7687896039e80-2855197324477878235.jpg"],
        quantity: 2,
        productName: "Xiaomi Redmi Note 10 Pro 8GB/128GB Chính Hãng VN/A",
        price: 7990000,
        description: "Xiaomi Redmi Note 10 Pro 8GB/128GB Chính Hãng VN/A",
        categoryId: "6546696dfd6325186efcf4d7",
        keywords: ["dien thoai", "tech", "phone"],
    }
}