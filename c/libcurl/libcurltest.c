#include <stdio.h>
#include <string.h>
#include <curl/curl.h>

int isProtocolPresent(const char * const * protocols, char *protocol) {
  for (int i = 0; protocols[i]; ++i)
    if (strncmp("https", protocols[i], strlen(protocol)) == 0)
      return 1;
  return 0;
}

int main(int argc, char **argv) {
  CURL *curl;
  CURLcode res;
  // Initial libcurl
  curl_global_init(CURL_GLOBAL_SSL);

  curl_version_info_data *curl_info = curl_version_info(CURLVERSION_NOW);
  fprintf(stdout, "curl version: %s (SSL: %s, HTTPS: %s)\n",
          curl_info->version,
          curl_info->features & CURL_VERSION_SSL ? "OK" : "NOK!",
          isProtocolPresent(curl_info->protocols, "https") ? "OK" : "NOK!");
  curl = curl_easy_init();
  if (curl) {
    // Do not verify certificate
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
    // Perform a POST
    curl_easy_setopt(curl, CURLOPT_POST, 1L);
    // Provide the URL
    curl_easy_setopt(curl, CURLOPT_URL, "https://localhost:8000/sensor/1/1");
    // Perform a PUT
    res = curl_easy_perform(curl);
    if(res != CURLE_OK)
      fprintf(stderr, "curl_easy_perform() failed: %s\n",
              curl_easy_strerror(res));
  }
  curl_easy_cleanup(curl);
  // Power down libcurl
  curl_global_cleanup();
  return 0;
}
