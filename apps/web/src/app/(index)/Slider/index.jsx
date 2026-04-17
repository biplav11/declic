import { getAlignment } from '@/utlls/utilityFunctions';
import { Carousel } from 'antd';
import Link from 'next/link';
import styles from './index.module.scss'
import { getImageUrl } from '@/utlls/pocketbase';

async function App({ sliders }) {
    // await new Promise(resolve => setTimeout(resolve, 5000))
    return (
        <Carousel autoplay>
            {
                sliders.map(({ image, title, subtitle, id, link, dark_text, alignment, collectionId }) => {
                    const align = getAlignment(alignment)
                    return (
                        <div key={id}>
                            <div className={styles.wrapper} style={{ ...align, backgroundImage: `url('${getImageUrl(image, collectionId, id)}')` }}>
                                <Link className={styles.link} href={link || "http://asterdio.com"} style={{ color: dark_text ? "#000" : "#fff" }}>
                                    <h1 className={styles.title}>{title}</h1>
                                    <h2 className={styles.subTitle}>{subtitle}</h2>
                                </Link>
                            </div>
                        </div>
                    )
                })
            }
        </Carousel>
    );
};
export default App;