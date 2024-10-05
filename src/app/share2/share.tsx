'use client'
import styles from './styles.module.scss';
import Image from 'next/image';
import copyLinkIcon from '../../../public/static/images/pages/share/copy-link.svg';
import imagesIcon from '../../../public/static/images/pages/share/images-icon.svg';
import calendarImage from '../../../public/static/images/pages/share/calendar-image.png';
import { PageContainer } from '@/components/utils/page-container';
import backArrow from '../../../public/static/images/pages/share/back-icon.svg';
import socialShareIcon from '../../../public/static/images/pages/share/share-icon.svg';

interface ShareProps {
    shareLink: string, 
    hideShareButton?: boolean
}


export function Share2({shareLink, hideShareButton}:  ShareProps) {
    return (
        <PageContainer>
            <div className={styles.main_content}>
                <button className={styles.button}>
                    <Image src={backArrow} alt="backicon" />
                    Back
                </button>
                <h1 className={styles.header}>Invite friends</h1>
                <Image className={styles.calendar_image} src={calendarImage} alt="calendar" />
                <p className={styles.paragraph}>Invite friends to support your challenge by taking an action: register
        to vote, get election reminders, or take the 8by8 challenge.</p>
            </div>
            <div className={styles.button_container}>
                <button className={styles.button}><Image src={copyLinkIcon} alt="copylink" />Copy link</button>
                {!hideShareButton && <button className={styles.button}><Image src={socialShareIcon} alt="socialshareicon" />Share via</button>}
                <button className={styles.button}><Image src={imagesIcon} alt="imagesicon" />Images for posts</button>
            </div>
        </PageContainer>
    )
}




