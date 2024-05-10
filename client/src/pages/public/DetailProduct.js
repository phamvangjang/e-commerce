import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct } from "../../apis";
import { Breadcrumb } from "../../components";

const DetailProduct = () => {
    const { pid, title, category } = useParams()
    const [product, setProduct] = useState(null)
    const fetchProductData = async () => {
        const response = await apiGetProduct(pid)
        if (response.success) setProduct(response.productDada)
    }

    useEffect(() => {
        if (pid) fetchProductData()
    }, [pid])
    return (
        <div className="w-full">
            <div className="h-[80px] flex justify-center items-center bg-gray-200">
                <div className="w-main">
                    <h3>{title}</h3>
                    <Breadcrumb title={title} category={category} />
                </div>
            </div>
        </div>
    )
}
export default DetailProduct