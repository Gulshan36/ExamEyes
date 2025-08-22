// fvgtbhynjumki

// Write your code here.


// This is your first Java program
public class EvenNumbers {

    // Function to print the first 10 even numbers
    public static void printEvenNumbers() {
        int count = 0; // Counter for even numbers
        int number = 2; // Start with the first even number

        while (count < 10) {
            System.out.println(number); // Print the even number
            number += 2; // Move to the next even number
            count++; // Increment the counter
        }
    }

    public static void main(String[] args) {
        printEvenNumbers(); // Call the function
    }
}
