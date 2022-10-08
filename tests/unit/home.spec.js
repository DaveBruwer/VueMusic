import Home from "@/views/HomeView.vue";
import SongItem from "@/components/SongItem.vue";
import { shallowMount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";

describe("Home.vue", () => {
  test("renders list of songs", () => {
    const songs = [
      {}, {}, {},
    ];

    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
    });

    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);
  });
});
