import axios from 'axios';
import { Layout, Products } from '../../src/components';
import woocommerce from '../../src/utils/woocommerce';
import { SITE_INFO, MENU, LOGO } from '../../src/utils/endpoints';

const Category = (props) => {
	const { title, description, menu, category, products, logo, categoriesFooter } = props;
	return (
		<Layout logo={logo} menu={menu} title={title} description={description} categories={categoriesFooter}>
			<Products products={products} title={category.name} />
		</Layout>
	);
};

export default Category;

export async function getStaticProps(context) {
	const {
		params: { slug },
	} = context;
	const logo = await axios.get(LOGO);
	const menu = await axios.get(MENU);
	const info = await axios.get(SITE_INFO);
	const category = await woocommerce.get('products/categories', { slug: slug });
	const products = await woocommerce.get('products', { category: `${category.data[0].id}` });
	const categoriesFooter = await woocommerce.get('products/categories', { per_page: 6 });

	return {
		props: {
			logo: logo.data,
			menu: menu.data,
			title: info.data.name,
			description: info.data.description,
			category: category.data[0],
			products: products.data,
			categoriesFooter: categoriesFooter.data,
		},
		revalidate: 1,
	};
}

export async function getStaticPaths() {
	const categories = await woocommerce.get(`products/categories`);
	const pathsData = [];
	categories.data.map((category) => {
		pathsData.push({ params: { slug: category.slug } });
	});
	return {
		paths: pathsData,
		fallback: false,
	};
}
