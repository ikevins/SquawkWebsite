import React, {useState, useEffect} from 'react';
import DashboardHeader from '../../components/DashboardHeader';

import all_orders from '../../constants/orders';
import {calculateRange, sliceData} from '../../utils/table-pagination';

import '../styles.css';
import DoneIcon from '../../assets/icons/done.svg';
import CancelIcon from '../../assets/icons/cancel.svg';

var userLocation = localStorage.getItem('user_location');

const app_name = 'cop4331-1738'
function buildPath(route)
{
    if (process.env.NODE_ENV === 'production') 
    {
        return 'https://' + app_name +  '.herokuapp.com/' + route;
    }
    else
    {        
        return 'http://localhost:5000/' + route;
    }
}

//var all_orders;


//yelpFusion();


const yelpFusion = async () => {

     try {

        const response = await fetch(buildPath('yelp/search?location='+ userLocation));
        var Results = await response.json();
        console.log(Results);
        all_orders = Results;
    }
    catch(e)
    {
        console.log(e.toString());
        return;
    }    
};


function doNewLocation(){
    window.location.href = "/location"
}


function Orders () {
    const [search, setSearch] = useState('');
    const [orders, setOrders] = useState(all_orders);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState([]);

    useEffect(() => {
        setPagination(calculateRange(all_orders, 5));
        setOrders(sliceData(all_orders, page, 5));
    }, []);

    // Search
    const __handleSearch = (event) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            let search_results = orders.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.categories[0].alias.toLowerCase().includes(search.toLowerCase()) ||
                item.categories[0].title.toLowerCase().includes(search.toLowerCase())
            );
            setOrders(search_results);
        }
        else {
            __handleChangePage(1);
        }
    };

    // Change Page 
    const __handleChangePage = (new_page) => {
        setPage(new_page);
        setOrders(sliceData(all_orders, new_page, 5));
    }

    return(
        <div id="landingBackground" >
            <div className='dashboard-content'>
                <DashboardHeader
                    btnText="Change Location" />

                <div className='dashboard-content-container'>
                    <div className='dashboard-content-header'>
                        <h2>Restaurants</h2>
                        <div className='dashboard-content-search'>
                            <input
                                type='text'
                                value={search}
                                placeholder='Search..'
                                className='dashboard-content-input'
                                onChange={e => __handleSearch(e)} />
                        </div>
                    </div>

                    <table>
                        <thead>
                            <th>RATING</th>
                            <th>DISTANCE</th>
                            <th>STATUS</th>
                            <th>NAME</th>
                            <th>TYPE OF FOOD</th>
                            <th>COST</th>
                        </thead>

                        {orders.length !== 0 ?
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={index}>
                                        <td><span>{order.rating}</span></td>
                                        <td><span>{(Math.floor((order.distance/1609.344)*10)/10) + ' mi'}</span></td>
                                        <td>
                                            <div>
                                                {order.is_closed == false ?
                                                    <img
                                                        src={DoneIcon}
                                                        alt='paid-icon'
                                                        className='dashboard-content-icon' />
                                                : order.is_closed == true ?
                                                    <img
                                                        src={CancelIcon}
                                                        alt='canceled-icon'
                                                        className='dashboard-content-icon' />
                                                : null}
                                                <span>{order.is_closed}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <img 
                                                    src={order.image_url}
                                                    className='dashboard-content-avatar'
                                                    alt={order.name} />
                                                <span>{order.name}</span>
                                            </div>
                                        </td>
                                        <td><span>{order.categories[0].title}</span></td>
                                        <td><span>{order.price}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        : null}
                    </table>

                    {orders.length !== 0 ?
                        <div className='dashboard-content-footer'>
                            {pagination.map((item, index) => (
                                <span 
                                    key={index} 
                                    className={item === page ? 'active-pagination' : 'pagination'}
                                    onClick={() => __handleChangePage(item)}>
                                        {item}
                                </span>
                            ))}
                        </div>
                    : 
                        <div className='dashboard-content-footer'>
                            <span className='empty-table'>No data</span>
                        </div>
                    }
                </div>
            </div>
            <input type="submit" id="loginButton" class="buttons" value="Change location"
                            onClick={doNewLocation} />
        </div>
    )
}

export default Orders;