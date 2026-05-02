CREATE TABLE Artists (
    Artist_ID UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Photo_URL VARCHAR(500),
    Description TEXT
);

CREATE TABLE Record_Types (
    Type_ID INT SERIAL PRIMARY KEY,
    Name VARCHAR(20) NOT NULL
);

CREATE TABLE Qualitys (
    Quality_ID INT SERIAL PRIMARY KEY,
    Name VARCHAR(15) NOT NULL,
    Bitrate VARCHAR(25) NOT NULL,
    Sample_Rate VARCHAR(25)
);

CREATE TABLE Records (
    Record_ID UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Artist_ID UUID NOT NULL REFERENCES Artists (Artist_ID),
    Cover_URL VARCHAR(500),
    Type_ID INT NOT NULL REFERENCES Record_Types (Type_ID),
    Quality_ID INT NOT NULL REFERENCES Qualitys (Quality_ID),
    Year INT
);

CREATE TABLE Tracks (
    Track_ID UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Record_ID UUID NOT NULL REFERENCES Records (Record_ID),
    Track_Num INT NOT NULL,
    Audio_URL VARCHAR(500),
    Quality_ID INT NOT NULL REFERENCES Qualitys (Quality_ID),
    Duration INT NOT NULL, -- en segundos
    Lyrics TEXT,
    -- idx_track_num_record (Record_ID, Track_Num)
);

CREATE TABLE Profiles (
    User_ID UUID REFERENCES auth.users (id) PRIMARY KEY,
    Nickname VARCHAR(80)
);

CREATE TABLE Status (
    Name VARCHAR(30) PRIMARY KEY
);

CREATE TABLE Playlists (
    Playlist_ID UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    Owner_ID UUID REFERENCES auth.users (id),
    Name VARCHAR(200) NOT NULL,
    Description VARCHAR(400),
    Cover_URL VARCHAR(500),
    Status VARCHAR(30) DEFAULT 'public' REFERENCES Status (Name), -- Public / Private
    Date_Added TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Users_Tracks (
    User_ID UUID REFERENCES auth.users (id),
    Track_ID UUID REFERENCES Tracks (Track_ID),
    Date_Added TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (User_ID, Track_ID)
);

CREATE TABLE Users_Records (
    User_ID UUID REFERENCES auth.users (id),
    Record_ID UUID REFERENCES Records (Record_ID),
    Date_Added TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (User_ID, Record_ID)
);

CREATE TABLE Users_Artists (
    User_ID UUID REFERENCES auth.users (id),
    Artist_ID UUID REFERENCES Artists (Artist_ID),
    Date_Added TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (User_ID, Artist_ID)
);

CREATE TABLE Users_Playlists (
    User_ID UUID REFERENCES auth.users (id),
    Playlist_ID UUID REFERENCES Playlists (Playlist_ID),
    Date_Added TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (User_ID, Playlist_ID)
);

CREATE TABLE Playlists_Tracks (
    Playlist_ID UUID REFERENCES Playlists (Playlist_ID),
    Track_ID UUID REFERENCES Tracks (Track_ID),
    Position INT NOT NULL,
    Date_Added TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (Playlist_ID, Position)
);