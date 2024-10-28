import styles from './RoundedImage.module.css'

function RoundedImage({src, alt, widht}) {
    return (
        <img 
            className={`${styles.rounded_image} ${styles[widht]}`}
            src={src}
            alt={alt}
        />
    )
}

export default RoundedImage