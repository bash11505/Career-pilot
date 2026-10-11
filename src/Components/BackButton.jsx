import { useNavigate } from "react-router-dom";

function BackButton() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="Button">
            <button
                type="button"
                onClick={handleBack}
            >
                Back
            </button>
        </div>
    );
}

export default BackButton;
