import RegisterForm from "../../components/forms/RegisterForm";
import SplashCursor from "../../components/SplashCursor";

export default function Register() {
    return (
        <section className="min-h-screen flex items-center justify-center relative">
            <SplashCursor
                SIM_RESOLUTION={64}
                DYE_RESOLUTION={512}
                DENSITY_DISSIPATION={2.0}
                VELOCITY_DISSIPATION={0.98}
                PRESSURE={0.8}
                CURL={30}
                SPLAT_RADIUS={0.25}
                SPLAT_FORCE={3000}
                COLOR_UPDATE_SPEED={5}
                SHADING={false}
            />
            <RegisterForm />
        </section>
    );
}