// NO, PLEASE, ANYTHING BUT C. I HATE C PLEASE PLEASE PLEASE PLEASE PLEASE PLEASE
// I DO NOT WANT TO WRITE C CODE
// I HATE C SO MUCH
// C IS THE WORST LANGUAGE IN THE WORLD
// I HATE C SO MUCH

#ifdef _WIN32
    #include <windows.h>
#else
    #include <time.h>
#endif

#ifdef _WIN32
    // WHAT DOES __declspec(dllexport) EVEN MEAN
    __declspec(dllexport)
#endif
void sys_sleep_ms(unsigned long milliseconds) {
#ifdef _WIN32
    Sleep(milliseconds);
#else
    struct timespec req;
    req.tv_sec = milliseconds / 1000;
    req.tv_nsec = (milliseconds % 1000) * 1000000L;
    nanosleep(&req, NULL);
#endif
}
