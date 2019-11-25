import os
import redis

# Path Manipulation
# To get the path of the file in docker-container bind-mount
# That the user uploaded
class PathManipulator:

    # Constructor
    def __init__(self, mount_target):

        self.BASEDIR = '/' + mount_target + '/'
        
    # Map file-path from host OS in the docker bind-mount
    def path_in_mount(self, file_path):
        
        # For windows only
        # For Linux/Ubuntu, Mac this has no effect on file-path
        file_path = file_path.split(':')

        if len(file_path) > 1:
            file_path[0] = file_path[0].lower()
        
        file_path = ''.join(file_path)
        file_path = file_path.replace('\\', '/')
        
        return self.BASEDIR + file_path