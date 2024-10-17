class QuickSortingAlgorithm {
    constructor(numbers) {
        this.numbers = numbers;
        this.states = [[...this.numbers.slice()]];
    }

    quickSort(arr = this.numbers, low = 0, high = this.numbers.length - 1) {
        if (low < high) {
            const pivotIndex = this.partition(arr, low, high);

            // Store the current state after partitioning
            this.states.push([...arr.slice()]);

            // Recursively sort elements before and after partition
            this.quickSort(arr, low, pivotIndex - 1);
            this.quickSort(arr, pivotIndex + 1, high);
        }
    }

    partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        // Place the pivot in the correct position
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }

    sort() {
        this.quickSort();
        return this.states;
    }
}



class BubbleSortingAlgorithm {
    constructor(numbers) {
        this.numbers = numbers
    }

    sort() {
        const states = [[...this.numbers.slice()]];
        for(let i = 0; i < this.numbers.length; i++) {
            for(let j = 0; j < this.numbers.length - i - 1; j++) {
                if(this.numbers[j] > this.numbers[j + 1]) {
                    let temp = this.numbers[j]
                    this.numbers[j] = this.numbers[j + 1]
                    this.numbers[j + 1] = temp;
                    states.push([...this.numbers.slice()]);
                }
            }
        }
        return states;
    }
}


class SelectionSortingAlgorithm {
    constructor(numbers) {
        this.numbers = numbers
    }

    sort() {
        const states = [[...this.numbers.slice()]];
        for(let i = 0; i < this.numbers.length; i++) {
            let minIndex = i;
            for(let j = i + 1; j < this.numbers.length; j++) {
                if(this.numbers[j] < this.numbers[minIndex]) {
                    minIndex = j;
                }
            }
            let temp = this.numbers[i];
            this.numbers[i] = this.numbers[minIndex];
            this.numbers[minIndex] = temp;
            states.push([...this.numbers.slice()]);
        }
        return states;
    }
}

class MergeSortingAlgorithm {
    constructor(numbers) {
        this.numbers = numbers;
        this.states =  [[...this.numbers.slice()]];
    }

    mergeSort(arr = this.numbers, left = 0, right = this.numbers.length - 1) {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        // Recursively sort both halves
        this.mergeSort(arr, left, mid);
        this.mergeSort(arr, mid + 1, right);

        // Merge the two halves
        this.merge(arr, left, mid, right);

        // Store the current state
        this.states.push([...arr.slice()]);
    }

    merge(arr, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            k++;
        }

        // Copy the remaining elements of leftArr, if any
        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            i++;
            k++;
        }

        // Copy the remaining elements of rightArr, if any
        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            j++;
            k++;
        }
    }

    sort() {
        this.mergeSort();
        return this.states;
    }
}

class InsertionSortingAlgorithm {
    constructor(numbers) {
        if (!Array.isArray(numbers)) {
            throw new TypeError("Expected an array of numbers.");
        }
        this.numbers = [...numbers]; // Create a copy to avoid mutating the original array
        this.states = [[...this.numbers.slice()]]; // Initialize states with the initial array
    }

    sort() {
        for (let i = 1; i < this.numbers.length; i++) {
            let key = this.numbers[i];
            let j = i - 1;

            // Move elements that are greater than key one position ahead
            while (j >= 0 && this.numbers[j] > key) {
                this.numbers[j + 1] = this.numbers[j];
                j--;
                
                // Capture the state after each shift
                this.states.push(this.numbers.slice());
            }
            
            this.numbers[j + 1] = key;
            
            // Capture the state after insertion
            this.states.push(this.numbers.slice());
        }
        return this.states;
    }
}

