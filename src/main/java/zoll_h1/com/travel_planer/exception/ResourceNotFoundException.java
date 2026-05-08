package zoll_h1.com.travel_planer.exception;

public class ResourceNotFoundException extends RuntimeException{
        public ResourceNotFoundException(String resourceName, Long resourceId) {
            super(String.format("%s with ID %d not found", resourceName, resourceId));
        }
        public ResourceNotFoundException(String message) {
            super(message);
        }
}
