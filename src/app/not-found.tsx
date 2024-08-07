import Image from 'next/image';
import { PageContainer } from '@/components/utils/page-container';
import notFound from '@/../public/static/images/pages/not-found/404.png';

export default function NotFound() {

    return (
        <PageContainer>
            <section>
                <Image src={notFound} alt="404, page not found" />
            </section>
        </PageContainer>
    );
}