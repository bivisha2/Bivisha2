interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'white' | 'gray';
}

const LoadingSpinner = ({ size = 'md', color = 'blue' }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const colorClasses = {
        blue: 'text-blue-600',
        white: 'text-white',
        gray: 'text-gray-600'
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}>
            </div>
        </div>
    );
};

export default LoadingSpinner;