import {Helmet, HelmetProvider} from "react-helmet-async";

const TitleComponent = (props) => {
    let title = props.title;
    if (props.count > 0) {
        title = `[${props.count}] ${props.title}`;
    }

    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
            </Helmet>
        </HelmetProvider>
    );
}

export default TitleComponent;
