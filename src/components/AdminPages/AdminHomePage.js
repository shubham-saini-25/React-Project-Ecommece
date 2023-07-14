import React, { useEffect, useState } from 'react';
import { getCategoriesCount } from '../../Api/CategoryApi';
import { getProductsCount } from '../../Api/ProductApi';
import { ToastContainer, toast } from 'react-toastify';
import { getOrdersCount } from '../../Api/OrderApi';
import { getUsersCount } from '../../Api/UserApi';
import { Link } from 'react-router-dom';

const AdminHomePage = () => {
    const [totalCategoryCount, setTotalCategoryCount] = useState(0);
    const [totalProductCount, setTotalProductCount] = useState(0);
    const [totalOrderCount, setTotalOrderrCount] = useState(0);
    const [totalUserCount, setTotalUserCount] = useState(0);

    const getCounts = async () => {
        try {
            const category = await getCategoriesCount();
            setTotalCategoryCount(category.totalCategoryCount);

            const product = await getProductsCount();
            setTotalProductCount(product.totalProductCount);

            const order = await getOrdersCount();
            setTotalOrderrCount(order.totalOrderCount);

            const user = await getUsersCount();
            setTotalUserCount(user.totalUserCount);
        } catch (err) {
            toast.error(err.response.message)
        }
    }

    useEffect(() => {
        getCounts();
    }, []);

    return (
        <div className="container">
            <ToastContainer />
            <div className="row">
                <main role="main" className="">
                    <div className="pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h1 text-center">Admin Dashboard</h1>
                    </div>
                    <div className="row d-flex justify-content-center text-center">
                        <div className="col-md-4">
                            <div className="card mb-4">
                                <div className="card-header h3">Total Categories</div>
                                <div className="card-body">
                                    <p className="card-title fs-4">Number of Total Categories = <b>{totalCategoryCount}</b></p>
                                    <p className="card-text">The total number of Categories will display here.</p>
                                    <Link to={'/admin/view-category'} className="btn btn-primary fw-bold">View Categories</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card mb-4">
                                <div className="card-header h3">Total Products</div>
                                <div className="card-body">
                                    <p className="card-title fs-4">Number of Total Products = <b>{totalProductCount}</b></p>
                                    <p className="card-text">The total number of Products will display here.</p>
                                    <Link to={'/admin/view-products'} className="btn btn-primary fw-bold">View Products</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card mb-4">
                                <div className="card-header h3">Total Users</div>
                                <div className="card-body">
                                    <p className="card-title fs-4">Number of Total Users = <b>{totalUserCount}</b></p>
                                    <p className="card-text">The total number of Customers will display here.</p>
                                    <Link to={'/admin/view-customers'} className="btn btn-primary fw-bold">View Users</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card mb-4">
                                <div className="card-header h3">Total Orders</div>
                                <div className="card-body">
                                    <p className="card-title fs-4">Number of Total Orders = <b>{totalOrderCount}</b></p>
                                    <p className="card-text">The total number of Orders will display here.</p>
                                    <Link to={'/admin/view-orders'} className="btn btn-primary fw-bold">View Orders</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminHomePage;