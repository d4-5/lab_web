import os

dirs_to_search = input("Enter a list of directories to search, separated by commas: ").split(",")
result_file = "result.txt"

with open(result_file, "a") as f:
    for dir_path in dirs_to_search:
        for root, dirs, files in os.walk(dir_path.strip()):
            for file in files:
                if file == result_file:
                    continue
                file_path = os.path.join(root, file)
                print(f"Reading contents of file {file_path}...")
                f.write(f"Contents of a file {file_path}\n")
                with open(file_path, "r") as infile:
                    f.write(infile.read())
                f.write(f"End of file {file_path}\n")

print(f"All files in the specified directories have been read and written to {result_file}.")
