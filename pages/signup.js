import axios from 'axios';
import { SITE_INFO, MENU, LOGO } from '../src/utils/endpoints';
import { Layout, SignUp } from '../src/components';
import woocommerce from '../src/utils/woocommerce';

const SignUpPage = (props) => {
	const { title, description, menu, logo, categoriesFooter } = props;
	return (
		<Layout logo={logo} menu={menu} title={title} description={description} categories={categoriesFooter}>
			<SignUp />
		</Layout>
	);
};
export default SignUpPage;

export async function getStaticProps() {
	const logo = await axios.get(LOGO);
	const menu = await axios.get(MENU);
	const info = await axios.get(SITE_INFO);
	const categoriesFooter = await woocommerce.get('products/categories', { per_page: 6 });
	return {
		props: {
			logo: logo.data,
			menu: menu.data,
			title: info.data.name,
			description: info.data.description,
			categoriesFooter: categoriesFooter.data,
		},
		revalidate: 1,
	};
}
