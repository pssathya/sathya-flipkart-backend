import Product from './model/productSchema.js';
import { products } from './constants/product.js';

const InsertDefaultData = async () => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(products);

        console.log('Data imported Successfully');
        
    } catch (error) {
        console.log('Error while inserting default data : ', error.message);
    }
}

export default InsertDefaultData;