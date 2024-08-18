import Image from 'next/image';
import { PageContainer } from '@/components/utils/page-container';
import notFound from '@/../public/static/images/pages/not-found/404.png';
import styles from './not-found.module.scss';

export default function NotFound() {
    return (
        <PageContainer>
            <section className={styles.container}>
                <Image src={notFound} alt="404, page not found" />
                <h1>Not Found</h1>
            </section>
        </PageContainer>
    );
}
